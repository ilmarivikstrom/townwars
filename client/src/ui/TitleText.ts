import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";

export default class TitleText {
  private text!: Phaser.GameObjects.Text;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const text = scene.add.text(Config.WINDOW_WIDTH / 2, 150, "Townwars", {
      color: toHexColor(Color.MENU_BLUE),
      fontFamily: "CaskaydiaMono",
      fontSize: 92,
    });
    text.setOrigin(0.5, 0.5);

    const glowConfig = {
      color: Phaser.Display.Color.IntegerToColor(Color.MENU_BLUE).lighten(20)
        .color,
      outerStrength: 1,
      innerStrength: 0,
      knockout: false,
    };
    text.preFX?.addGlow(
      glowConfig.color,
      glowConfig.outerStrength,
      glowConfig.innerStrength,
      glowConfig.knockout
    );

    const shineConfig = {
      speed: 0.5,
      lineWidth: 2,
      gradient: 3,
      reveal: false,
    };
    text.preFX?.addShine(
      shineConfig.speed,
      shineConfig.lineWidth,
      shineConfig.gradient,
      shineConfig.reveal
    );

    const shadowConfig = {
      x: 0,
      y: 0,
      decay: 0.1,
      power: 1,
      color: Phaser.Display.Color.IntegerToColor(Color.MENU_BLUE).darken(50)
        .color,
      samples: 6,
      intensity: 1,
    };
    const shadow = text.preFX?.addShadow(
      shadowConfig.x,
      shadowConfig.y,
      shadowConfig.decay,
      shadowConfig.power,
      shadowConfig.color,
      shadowConfig.samples
    );
    scene.add.tween({
      targets: text,
      scale: 1.05,
      rotation: 0.03,
      duration: 3600,
      yoyo: true,
      repeat: -1,
    });
    scene.add.tween({
      targets: shadow,
      x: 0.25,
      y: -0.25,
      duration: 3600,
      yoyo: true,
      repeat: -1,
    });

    const wipeConfig = {
      wipeWidth: 0.02,
      direction: 0,
      axis: 1,
      reveal: true,
    };
    const wipe = text.preFX?.addReveal(
      wipeConfig.wipeWidth,
      wipeConfig.direction,
      wipeConfig.axis
    );

    scene.add.tween({
      targets: wipe,
      progress: 1,
      repeat: 0,
      duration: 2000,
    });

    const pointLightConfig = {
      x: text.x,
      y: text.y,
      color: Phaser.Display.Color.IntegerToColor(Color.MENU_BLUE).darken(45)
        .color,
      radius: 1,
      intensity: 1.0,
      attenuation: 0.03,
    };
    const pointLight = new Phaser.GameObjects.PointLight(
      scene,
      pointLightConfig.x,
      pointLightConfig.y,
      pointLightConfig.color,
      pointLightConfig.radius,
      pointLightConfig.intensity,
      pointLightConfig.attenuation
    );
    scene.add.existing(pointLight);
    scene.add.tween({
      targets: pointLight,
      radius: 512,
      ease: "Quint.easeInOut",
      duration: 4000,
      repeat: 0,
    });

    text.setDepth(Layers.UI);
    this.text = text;
  }

  public destroy(): void {
    this.text.destroy();
  }
}
