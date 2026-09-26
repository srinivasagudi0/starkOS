import { Link } from "react-router-dom"

function ProjectBreakdown() {
    return (
        <main>
            <h1>Project Breakdown</h1>
            <Link to="/coding">Back 🔙</Link>
            
            <section className="project-overview">
            <h2>Overview</h2>
            <p>Total Projects: </p>
            <p>Total Tracked Hours: </p>
            <p>Most Recent Project: </p>
            </section>

            
        </main>
    )
}

export default ProjectBreakdown