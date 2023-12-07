import { useParams } from "react-router-dom"

export default function ClientDetails () {
    const params = useParams();
    const clientId = params.clientId
    return (
        <div id="client-details">
            <h1>Client ID:{clientId} Details</h1>
        </div>
    )
}