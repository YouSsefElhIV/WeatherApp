import { useCallback } from "react"
import { loadSlim } from "tsparticles-slim"
import Particles from "react-tsparticles"

function Particlebg (){
    const particleInit = useCallback ( async engine =>{
        await loadSlim(engine)
    }, [])
    return(
        <Particles id="Particle" url="./particles.json"  init={particleInit}></Particles>
    )
}

export default Particlebg