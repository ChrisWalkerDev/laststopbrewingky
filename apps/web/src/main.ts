import { bootstrapApplication } from '@angular/platform-browser';
import { APP_CONFIG, loadRuntimeConfig } from './app/core/config/runtime-config';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';

void loadRuntimeConfig()
  .then((runtimeConfig) =>
    bootstrapApplication(App, {
      ...appConfig,
      providers: [...appConfig.providers, { provide: APP_CONFIG, useValue: runtimeConfig }],
    }),
  )
  .catch((error: unknown) => {
    console.error('Application configuration failed to load.', error);
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'The application could not start. Please try again later.';
    document.body.replaceChildren(message);
  });
