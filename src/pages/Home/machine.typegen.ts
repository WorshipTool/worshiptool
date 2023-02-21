
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.fetchingRecommended.Loading:invocation[0]": { type: "done.invoke.fetchingRecommended.Loading:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.fetchingRecommended.Loading:invocation[0]": { type: "error.platform.fetchingRecommended.Loading:invocation[0]"; data: unknown };
"xstate.after(5000)#fetchingRecommended.Error": { type: "xstate.after(5000)#fetchingRecommended.Error" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "fetchRecommendedSongs": "done.invoke.fetchingRecommended.Loading:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: "fetchRecommendedSongs";
        };
        eventsCausingActions: {
          "assignData": "done.invoke.fetchingRecommended.Loading:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "fetchRecommendedSongs": "xstate.after(5000)#fetchingRecommended.Error" | "xstate.init";
        };
        matchesStates: "Error" | "Loaded" | "Loading";
        tags: never;
      }
  