import React from "react"
import ReactDOM from "react-dom/client"
import { App as AntDesignApp } from "antd"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import App from "./App"
import "./Main.css"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AntDesignApp>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools />
                <App />
            </QueryClientProvider>
        </AntDesignApp>
    </React.StrictMode>
)
