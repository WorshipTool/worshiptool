import "./App.css";
import AppContainer from "./components/app/AppContainer";
import AppProviders from "./components/app/AppProviders";
import Snow from "./components/Snow";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
    return (
        <div>
            <AppProviders>
                <AppContainer />
            </AppProviders>
        </div>
    );
}

export default App;
