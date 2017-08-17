<template>
  <div class="loader-container">
    <div class="loader"></div>
    <div class="vertical-reference"></div>
  </div>
</template>

<style>
  .loader-container {
      position: absolute;
      height: 100%;
      width: 100%;
      line-height: 100%;
      text-align: center;
      top: 0;
      left: 0;
      vertical-align: middle;
  }
  .loader {
      vertical-align: middle;
      display: inline-block;
      border: .2em solid rgba(255, 255, 255, .25); /* Light grey */
      border-top: .2em solid #3498db; /* Blue */
      border-radius: 50%;
      width: 22px;
      height: 22px;
      animation: spin 1s linear infinite;
  }
  .vertical-reference {
    content: ' ';
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
  .blue .loader {
    border-top: .2em solid #fff; /* Blue */
  }
</style>