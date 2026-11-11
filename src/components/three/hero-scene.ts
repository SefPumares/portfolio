import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

/**
 * The hero's WebGL scene, kept in its own module so it is only downloaded when it will
 * actually be shown, and so named imports let the bundler tree-shake unused parts of three.js.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aRandom;
  varying float vAlpha;
  varying float vHeight;

  void main() {
    vec3 p = position;
    float wave =
        sin(p.x * 0.32 + uTime * 0.55) * 0.55 +
        cos(p.z * 0.28 + uTime * 0.42) * 0.45 +
        sin((p.x + p.z) * 0.14 + uTime * 0.3) * 0.35;
    float d = distance(p.xz, uPointer);
    float ripple = exp(-d * d * 0.035) * (1.4 + 0.35 * sin(d * 1.3 - uTime * 3.2)) * uPointerStrength;
    p.y += wave + ripple;
    vHeight = p.y;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.7 + aRandom * 0.6) * (12.0 / -mv.z);
    vAlpha = smoothstep(55.0, 8.0, -mv.z);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHighlight;
  varying float vAlpha;
  varying float vHeight;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, r);
    float lift = clamp((vHeight + 0.6) / 2.6, 0.0, 1.0);
    vec3 color = mix(uColor, uHighlight, lift);
    gl_FragColor = vec4(color, glow * vAlpha * (0.55 + 0.75 * lift));
  }
`

/**
 * Mounts the scene into `container`. Calls `onReady` once the first frame is drawn.
 * Returns a cleanup function that stops rendering and frees every GPU resource.
 */
export function createHeroScene(container: HTMLElement, onReady: () => void): () => void {
  const small = window.innerWidth < 768
  const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' })
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(pixelRatio)
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.classList.add('block', 'size-full')
  container.appendChild(renderer.domElement)

  const scene = new Scene()
  const camera = new PerspectiveCamera(50, 1, 0.1, 100)
  const cameraBase = new Vector3(0, 5.5, 16)
  camera.position.copy(cameraBase)
  const lookTarget = new Vector3(0, 0, -4)

  // Grid of points on the XZ plane; fewer on small screens.
  const spacing = small ? 0.75 : 0.45
  const cols = Math.floor((small ? 44 : 72) / spacing)
  const rows = Math.floor((small ? 36 : 44) / spacing)
  const count = cols * rows
  const positions = new Float32Array(count * 3)
  const randoms = new Float32Array(count)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const k = i * rows + j
      positions[k * 3] = (i - cols / 2) * spacing
      positions[k * 3 + 1] = 0
      positions[k * 3 + 2] = (j - rows / 2) * spacing - 6
      randoms[k] = Math.random()
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1))

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new Vector2(999, 999) },
    uPointerStrength: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uSize: { value: small ? 7 : 6 },
    uColor: { value: new Color('#2b9bd6') },
    uHighlight: { value: new Color('#8fdaff') },
  }
  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  const points = new Points(geometry, material)
  scene.add(points)

  // Pointer → point on the ground plane (y = 0), smoothed.
  const raycaster = new Raycaster()
  const plane = new Plane(new Vector3(0, 1, 0), 0)
  const ndc = new Vector2()
  const hit = new Vector3()
  const pointerTarget = new Vector2(999, 999)
  let pointerActive = false
  let tiltX = 0
  let tiltY = 0

  function onPointerMove(event: PointerEvent) {
    const r = container.getBoundingClientRect()
    if (event.clientY < r.top || event.clientY > r.bottom) {
      pointerActive = false
      return
    }
    ndc.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1)
    tiltX = ndc.x
    tiltY = ndc.y
    raycaster.setFromCamera(ndc, camera)
    if (raycaster.ray.intersectPlane(plane, hit)) {
      pointerTarget.set(hit.x, hit.z)
      pointerActive = true
    }
  }
  function onPointerLeave() {
    pointerActive = false
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)

  function resize() {
    const { clientWidth: w, clientHeight: h } = container
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Pull the camera back a little on portrait screens (capped, or the field fades into the distance).
    camera.position.z = cameraBase.z * Math.min(1.35, Math.max(1, 1.2 / camera.aspect))
    camera.updateProjectionMatrix()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  // Run only while visible.
  let visible = true
  let frame = 0
  let lastTime = 0 // rAF timestamp of the previous frame; 0 = just (re)started
  const intersection = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    schedule()
  })
  intersection.observe(container)
  const onVisibility = () => schedule()
  document.addEventListener('visibilitychange', onVisibility)

  function schedule() {
    const shouldRun = visible && !document.hidden
    if (shouldRun && !frame) {
      lastTime = 0 // do not count the paused interval as elapsed time
      frame = requestAnimationFrame(tick)
    } else if (!shouldRun && frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }

  function tick(now: number) {
    frame = requestAnimationFrame(tick)
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0
    lastTime = now
    uniforms.uTime.value += dt

    uniforms.uPointerStrength.value += ((pointerActive ? 1 : 0) - uniforms.uPointerStrength.value) * 0.05
    if (pointerActive) uniforms.uPointer.value.lerp(pointerTarget, 0.08)

    // Gentle camera tilt toward the pointer plus drift with scroll.
    const scrollShift = Math.min(window.scrollY, 800) * 0.004
    camera.position.x += (tiltX * 1.6 - camera.position.x) * 0.04
    camera.position.y += (cameraBase.y + tiltY * 0.8 + scrollShift - camera.position.y) * 0.04
    camera.lookAt(lookTarget)

    renderer.render(scene, camera)
  }

  schedule()
  const readyFrame = requestAnimationFrame(onReady)

  return () => {
    cancelAnimationFrame(readyFrame)
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onPointerMove)
    document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    resizeObserver.disconnect()
    intersection.disconnect()
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
}
