import YouTubePlayer from "./components/players/YouTubePlayer"
import SearchBar from "./components/search/SearchBar"

function App() {
    return (
        <div style={{ display: "flex", width: "100%", height: "100vh", justifyContent: "center", alignItems: "center" }}>
            <div>
                <SearchBar />
                <YouTubePlayer />
            </div>
        </div>
    )
}

export default App
