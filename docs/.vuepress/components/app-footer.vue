<template>
  <div class="app-footer">Digital Design Dictionary by <a href="https://hike.one" target="_blank" rel="noopener noreferrer"><img src="/logo.svg" alt="Logo of Hike One" height="15" /></a></div>
</template>

<script>
export default {
}
</script>

<style>
  .app-footer {
    position: fixed;
    width: 305px;
    bottom: 10px;
    z-index: 1;
    left: 50%;
    transform: translate(-50%, 0);
    color: #585858;
    background-color: white;
  }

  @media (min-width: 720px) {
    .app-footer {
      width: auto;
      left: 370px;
      transform: none;
    }
  }


  @media (min-width: 900px) {
    .app-footer {
      left: 50%;
      transform: none;
    }
  }
</style>
