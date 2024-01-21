import { Segment } from "semantic-ui-react"

const Footer = () => {

    return <>
        <Segment textAlign="left" id="footer">
            <svg viewBox="0 0 960 300">
                <symbol id="s-text">
                    <text textAnchor="middle" x="50%" y="80%">BRACHI </text>
                </symbol>
                <g className="g-ants">
                    <use href="#s-text" className="text-copy"></use>
                    <use href="#s-text" className="text-copy"></use>
                    <use href="#s-text" className="text-copy"></use>
                    <use href="#s-text" className="text-copy"></use>
                    <use href="#s-text" className="text-copy"></use>
                </g>
            </svg>
            <div className="font-color">
                brachig404@gmail.com
            </div>
        </Segment>
    </>
}

export default Footer