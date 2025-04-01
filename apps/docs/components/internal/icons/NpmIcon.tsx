import { SVGProps } from "react"

export const NpmIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={512}
        height={512}
        fill="currentColor"
        viewBox="0 0 512 512"
        {...props}
    >
        <path d="M0 327.304h142.624v28.734h113.89v-28.734H512V155.962H.016L0 327.304zm142.608-28.734h-28.734v-85.156H86.169v85.156h-58.48V184.68h114.919v113.89zm142.118.053h-55.917v28.68h-58.48V184.68h114.919l-.522 113.943zm199.552 0h-28.733v-85.21H426.81v85.21h-28.734v-85.21h-27.705v85.21H312.92V184.68h171.341l.016 113.943zM228.81 269.836h26.677v-56.439h-26.677v56.44z" />
    </svg>
)
