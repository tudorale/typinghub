import Helmet from "react-helmet";

function Html(props:any) {
    return (
        <Helmet>
                <title>{props.title}</title>
                <style>
                {`
                 body {
                    background-color: #0e0b11;       
                  }
                `}
                </style>
        </Helmet>
    )
}

export default Html
