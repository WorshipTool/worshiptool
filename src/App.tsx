import "./App.css";
import AppContainer from "./components/app/AppContainer";
import AppProviders from "./components/app/AppProviders";

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
