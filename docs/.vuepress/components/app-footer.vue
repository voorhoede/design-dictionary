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
    width: 100%;
    bottom: 0;
    z-index: 1;
    left: 50%;
    padding: 10px 0;
    transform: translate(-50%, 0);
    text-align: center;
    color: #585858;
    background-color: #f8f8f8;
  }

  @media (min-width: 720px) {
    .app-footer {
      left: 0;
      transform: none;
      padding-left: 340px;
    }
  }
</style>
