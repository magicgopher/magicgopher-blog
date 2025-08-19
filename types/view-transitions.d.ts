interface ViewTransition {
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    finished: Promise<void>;
}

interface Document {
    startViewTransition(callback: () => Promise<void> | void): ViewTransition;
}