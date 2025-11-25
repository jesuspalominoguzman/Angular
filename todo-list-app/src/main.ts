import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { importProvidersFrom } from '@angular/core';

import { TaskState } from './app/todo-list/store/states/tasks.state';

import { environment } from './app/environments/environment';


  bootstrapApplication(AppComponent, {
  providers: [

    ...(appConfig?.providers ?? []),
    importProvidersFrom(
      NgxsModule.forRoot([TaskState]),
      NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
      NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production })
    )
  ]
}).catch(err => console.error(err));