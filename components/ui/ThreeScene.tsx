'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const W = window.innerWidth
    const H = window.innerHeight

    /* ── Scene setup ── */
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)
    camera.position.z = 6

    /* ── Bokeh particle field ── */
    const COUNT     = 600
    const geometry  = new THREE.BufferGeometry()
    const positions = new Float32Array(COUNT * 3)
    const alphas    = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12
      alphas[i]             = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('alpha',    new THREE.BufferAttribute(alphas, 1))

    /* Circular sprite texture */
    const canvas  = document.createElement('canvas')
    canvas.width  = 64
    canvas.height = 64
    const ctx     = canvas.getContext('2d')!
    const grad    = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0,   'rgba(201,168,76,1)')
    grad.addColorStop(0.4, 'rgba(201,168,76,0.25)')
    grad.addColorStop(1,   'rgba(201,168,76,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    const sprite  = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      map: sprite,
      size: 0.18,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    /* ── Mouse parallax ── */
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.4
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', onMouseMove)

    /* ── Animate ── */
    let raf: number
    const clock = new THREE.Clock()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      particles.rotation.y = t * 0.018 + mouse.x
      particles.rotation.x = t * 0.009 + mouse.y
      renderer.render(scene, camera)
    }
    tick()

    /* ── Resize ── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const container = mountRef.current
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      sprite.dispose()
      renderer.dispose()
      container?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
