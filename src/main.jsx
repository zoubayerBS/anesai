import { h, render } from 'preact';
import App from './App';
import './index.css';

if (window.visualViewport) {
  const onResize = () => {
    const vh = window.visualViewport.height;
    document.documentElement.style.setProperty('--app-height', `${vh}px`);
  };
  window.visualViewport.addEventListener('resize', onResize);
  window.visualViewport.addEventListener('orientationchange', onResize);
  onResize();
}

render(<App />, document.getElementById('app'));
