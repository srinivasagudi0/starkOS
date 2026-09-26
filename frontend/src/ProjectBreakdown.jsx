import { useState, useEffect, use } from "react"
import { Link } from "react-router-dom"

function ProjectBreakdown() {

    const [selectedProject, setSelectedProject] = useState("")
    const [projects, setProjects] = useState([])
    const [story, setStory] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [totatProjects, setTotalProjects] = useState(0)
    const [totalHours, setTotalHours] = useState(0)
    const [recentProject, setRecentProject] = useState("")

    useEffect(() => {
        fetch("http://localhost:5000/project-breakdown/story", {
            credentials: "include"
        })
            .then(async (response) => {
                const data = await response.json()
                setTotalProjects(data.total_projects)
                setTotalHours(data.total_hours)
                setRecentProject(data.recent_project)
            })
            .catch((error) => setError(error.message))
    }, [])
    
    useEffect(() => {
        fetch("http://localhost:5000/project-breakdown/project-overview", {
            credentials: "include"
        })
            .then(async (response) => {
                const data = await response.json()
                setProjects(data.projects)
            })
            .catch((error) => setError(error.message))
    }, [])

    async function createProjectStory(event) {
        event.preventDefault()
        if (!selectedProject || loading) return

        setLoading(true)
        setStory("")
        setError("")

        try {
            const response = await fetch(
            "http://localhost:5000/project-breakdown/story",
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ project_name: selectedProject })
            }
            )

            const data = await response.json()
            setStory(data.story)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
    

    return (
        <main className="more-project-breakdown">
            <h1 className="title6">Project Breakdown</h1>
            <Link to="/coding">Back 🔙</Link>
            
            <section className="project-overview">
            <h2>Overview</h2>
            <p>Total Projects: {totatProjects}</p>
            <p>Total Tracked Hours: {totalHours}</p>
            <p>Most Recent Project: {recentProject}</p>
            </section>

            <section className="project-story">
                <form
                    onSubmit={createProjectStory}
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
                <br />
                <button type="submit" disabled={loading || !selectedProject}>
                    {loading ? "Writing..." : "View Story ➡️"}
                </button>
                </form>
                {error && <p role="alert">{error}</p>}
                {story && <p className="story">{story}</p>}
            </section>
        </main>
    )
}

export default ProjectBreakdown
