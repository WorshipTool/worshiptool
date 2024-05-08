import { lazy, Suspense } from "react";
import "./App.css";
import LoadingScreen from "./common/components/app/LoadingApp/LoadingScreen";

const AppContainer = lazy(() => import("./common/components/app/AppContainer"));
const AppProviders = lazy(() => import("./common/components/app/AppProviders"));

function App() {
    return (
        <div>
            <Suspense fallback={<LoadingScreen />}>
                <AppProviders>
                    <AppContainer />
                </AppProviders>
            </Suspense>
        </div>
    );
}

export default App;
