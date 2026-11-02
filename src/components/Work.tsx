import { portfolio } from '../content'
import { ProjectCase } from './ProjectCase'
import { Section } from './Section'

export function Work() {
  const { title, intro, projects } = portfolio.work
  return (
    <Section id="work" index="01" label="Work" title={title} intro={intro}>
      <div className="space-y-24 sm:space-y-32">
        {projects.map((project, i) => (
          <ProjectCase key={i} project={project} index={i} />
        ))}
      </div>
    </Section>
  )
}
