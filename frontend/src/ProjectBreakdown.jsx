import { useState } from "react"
import { Link, useNavigate} from "react-router-dom"

function ProjectBreakdown() {

    const [selectedProject, setSelectedProject] = useState("")
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])

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

            <section className="project-story">
                <form
                    onSubmit={(event) => {
                        event.preventDefault()

                    if (selectedProject) {
                        navigate(`/project-story/${encodeURIComponent(selectedProject)}`)
                    }
                }}
                    >
                <select
                    value={selectedProject}
                    onChange={(event) => setSelectedProject(event.target.value)}
                    required
                >
                    <option value="" disabled>Choose a project</option>

                    {projects.map((project) => (
                    <option key={project.name} value={project.name}>
                        {project.name}
                    </option>
                    ))}
                </select>

                <button type="submit" onClick={}>View story →</button>
                </form>
            </section>
        </main>
    )
}

export default ProjectBreakdown