<!-- src/components/ConfettiComponent.vue -->
<template>
  <div ref="confettiContainer" class="confetti-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const confettiContainer = ref(null);
let confettiInstance = null;

onMounted(() => {
  console.log('ConfettiComponent mounted');
  import('canvas-confetti')
    .then((confetti) => {
      console.log('canvas-confetti loaded successfully');
      confettiInstance = confetti.default;
      createConfetti();
    })
    .catch((error) => {
      console.error('Failed to load canvas-confetti:', error);
    });
});

const createConfetti = () => {
  if (!confettiInstance) {
    console.warn('confettiInstance is not available');
    return;
  }

  console.log('Creating confetti effect');
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  const fire = (particleRatio, opts) => {
    confettiInstance(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  };

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

onBeforeUnmount(() => {
  if (confettiInstance) {
    confettiInstance.reset();
  }
});
</script>

<style scoped>
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>
