import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import type PhaserType from 'phaser'

export type ParticleBurstApi = {
  burst: (x: number, y: number, intensity?: number) => void
}

type BurstSceneType = PhaserType.Scene & {
  burst: (x: number, y: number, intensity?: number) => void
}

export const RewardParticleCanvas = forwardRef<ParticleBurstApi>(
  function RewardParticleCanvas(_props, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<PhaserType.Game | null>(null)
    const sceneRef = useRef<BurstSceneType | null>(null)

    useEffect(() => {
      if (!containerRef.current || gameRef.current) return
      let destroyed = false

      void import('phaser').then((PhaserModule) => {
        if (destroyed || !containerRef.current || gameRef.current) return
        const Phaser = PhaserModule.default

        class BurstScene extends Phaser.Scene {
          private emitter: PhaserType.GameObjects.Particles.ParticleEmitter | null = null

          constructor() {
            super('BurstScene')
          }

          create() {
            const g = this.make.graphics({ x: 0, y: 0 }, false)
            g.fillStyle(0xffd700, 1)
            g.fillCircle(8, 8, 8)
            g.generateTexture('spark', 16, 16)
            g.clear()
            g.fillStyle(0xff8c00, 1)
            g.fillCircle(6, 6, 6)
            g.generateTexture('ember', 12, 12)
            g.clear()
            g.fillStyle(0xffffff, 1)
            g.fillCircle(4, 4, 4)
            g.generateTexture('starlet', 8, 8)
            g.destroy()

            this.emitter = this.add.particles(0, 0, 'spark', {
              speed: { min: 80, max: 280 },
              angle: { min: 0, max: 360 },
              scale: { start: 0.9, end: 0 },
              alpha: { start: 1, end: 0 },
              lifespan: { min: 400, max: 900 },
              gravityY: 180,
              emitting: false,
              blendMode: 'ADD',
            })

            this.add
              .particles(0, 0, 'ember', {
                speed: { min: 60, max: 200 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.7, end: 0 },
                alpha: { start: 0.9, end: 0 },
                lifespan: { min: 350, max: 800 },
                gravityY: 220,
                emitting: false,
                blendMode: 'ADD',
              })
              .setName('emberEmitter')

            this.add
              .particles(0, 0, 'starlet', {
                speed: { min: 40, max: 160 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: { min: 300, max: 700 },
                gravityY: 100,
                emitting: false,
                blendMode: 'ADD',
              })
              .setName('starEmitter')
          }

          burst(x: number, y: number, intensity = 1) {
            const count = Math.round(18 * intensity)
            this.emitter?.explode(count, x, y)
            const ember = this.children.getByName(
              'emberEmitter',
            ) as PhaserType.GameObjects.Particles.ParticleEmitter | null
            const star = this.children.getByName(
              'starEmitter',
            ) as PhaserType.GameObjects.Particles.ParticleEmitter | null
            ember?.explode(Math.round(12 * intensity), x, y)
            star?.explode(Math.round(10 * intensity), x, y)
          }
        }

        const scene = new BurstScene()
        sceneRef.current = scene as BurstSceneType

        const game = new Phaser.Game({
          type: Phaser.AUTO,
          parent: containerRef.current,
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: '#00000000',
          transparent: true,
          scene,
          scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          render: {
            transparent: true,
            antialias: true,
          },
          banner: false,
        })

        gameRef.current = game
      })

      return () => {
        destroyed = true
        gameRef.current?.destroy(true)
        gameRef.current = null
        sceneRef.current = null
      }
    }, [])

    useImperativeHandle(ref, () => ({
      burst(x: number, y: number, intensity = 1) {
        sceneRef.current?.burst(x, y, intensity)
      },
    }))

    return (
      <div
        ref={containerRef}
        className="pointer-events-none fixed inset-0 z-[99]"
        aria-hidden
      />
    )
  },
)
