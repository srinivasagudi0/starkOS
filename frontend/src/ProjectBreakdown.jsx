import { useState, useEffect} from "react"
import { Link } from "react-router-dom"

function ProjectBreakdown() {

    const [selectedProject, setSelectedProject] = useState("")
    const [projects, setProjects] = useState([])
    const [story, setStory] = useState("")
    const [loading, setLoading] = useState(true)
    const [projectsLoading, setProjectsLoading] = useState(true)
    const [recentLoading, setRecentLoading] = useState(true)
    const [storyLoading, setStoryLoading] = useState(false)
    const [error, setError] = useState("")
    const [totatProjects, setTotalProjects] = useState(0)
    const [totalHours, setTotalHours] = useState(0)
    const [recentProject, setRecentProject] = useState("")

    useEffect(() => {
        setLoading(true)
        fetch("/backend/project-breakdown/more/stats", {
            credentials: "include"
        })
            .then(async (response) => {
                const data = await response.json()
                setTotalProjects(data.num_projects)
                setTotalHours(data.total_hours)
                setRecentProject(data.recent_project)
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }, [])
    
    useEffect(() => {
        setProjectsLoading(true)
        fetch("/backend/project-breakdown/project-overview", {
            credentials: "include"
        })
            .then(async (response) => {
                const data = await response.json()
                setProjects(data.projects)
            })
            .catch((error) => setError(error.message))
            .finally(() => setProjectsLoading(false))
    }, [])

    async function createProjectStory(event) {
        event.preventDefault()
        if (!selectedProject || storyLoading) return

        setStoryLoading(true)
        setStory("")
        setError("")

        try {
            const response = await fetch(
            "/backend/project-breakdown/story",
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
                setStoryLoading(false)
            }
        }
    
        const [repoUrl, setRepoUrl] = useState("")
        const [recentCodingTime, setRecentCodingTime] = useState(0)
        const [lastCodingActivity, setLastCodingActivity] = useState("")
        const [lastCommitMessge, setLastCommitMessage] = useState("")
        const [latestCommitTime, setLatestCommitTime] = useState("")
        const [repoDescripiton, setRepoDescription] = useState("")
        const [filesChanged, setFilesChanged] = useState([])

        useEffect(() =>{
            setRecentLoading(true)
           fetch("/backend/hackatime/recent-project/stats", {
                credentials: "include"
            })
                .then(async response => {
                    const data = await response.json()
                    setRepoUrl(data.repo_url)
                    setRecentCodingTime(data.total_coding_time)
                    setLastCodingActivity(data.last_coding_activity)
                    setLastCommitMessage(data.latest_commit_message)
                    setLatestCommitTime(data.latest_commit_time)
                    setRepoDescription(data.repo_description)
                    setFilesChanged(data.files_changed)
                })
                .catch((error) => console.log(error))
                .finally(() => setRecentLoading(false))
        },[])

    return (
        <main className="more-project-breakdown">
            {loading || projectsLoading || recentLoading ? (
                <p className="loading-message">
                    Mapping your latest projects, Srinivasa...
                </p>
            ) : (
            <>
            <h1 className="title6">Project Breakdown</h1>
            <Link to="/coding">Back 🔙</Link>

            <section className="recent-project">
                <h1>Most Recent Project: {recentProject}</h1>
                <h2>Description: {repoDescripiton}</h2>
                <li>Total Coding Time: {recentCodingTime} hrs</li>
                <li>Last Coding Activity: {lastCodingActivity}</li>
                <li>Latest Commit Message: {lastCommitMessge}</li>
                <li>Commit Time: {latestCommitTime}</li>
                <li>Files changed in the latest commit: </li>
                <ul>
                {filesChanged.map((files, index) => (
                    <li>{files}</li>
                
                ))}
                </ul>
            </section>
            
            <section className="project-overview">
                <br/>
            <h2>Overview</h2>
            <p>Total Projects: {totatProjects}</p>
            <p>Total Tracked Hours: {totalHours}</p>

            </section>

            <section className="project-story">
                <h1>Read your Project as a Story</h1>
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
                <button type="submit" disabled={storyLoading || !selectedProject}>
                    {storyLoading ? "Writing..." : "View Story ➡️"}
                </button>
                </form>
                {error && <p role="alert">{error}</p>}
                {story && <p className="story">{story}</p>}
            </section>
            </>
            )}
        </main>
    )
}

export default ProjectBreakdown
