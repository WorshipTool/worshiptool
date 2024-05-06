import "./App.css";
import AppContainer from "./common/components/app/AppContainer";
import AppProviders from "./common/components/app/AppProviders";

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
