import React from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';

const OffCanvas = ({
    componentFrom,

    offcanvasClassname,
    offcanvasHeaderClassname,
    canvasHeader,

    offcanvasBodyClassname,
    canvasBody,

    offCanvasShow,
    handleCanvasOpenOrClose,
    offcanvasResponsive
}) => {


    return (
        <Offcanvas
            show={offCanvasShow}
            onHide={handleCanvasOpenOrClose}
            responsive={offcanvasResponsive}
            backdrop="static"
            className={offcanvasClassname}>

            <Offcanvas.Header
                closeButton
                className={offcanvasHeaderClassname}>
                <Offcanvas.Title>
                    {canvasHeader}
                </Offcanvas.Title>
            </Offcanvas.Header>


            <Offcanvas.Body className={offcanvasBodyClassname}>
                {canvasBody}
            </Offcanvas.Body>

        </Offcanvas>
    )
}

export default OffCanvas;


//how to use offcanvas EXAMPLE:

// const [offCanvasShow, setoffCanvasShow] = useState(false)
//   const handleCanvasOpenOrClose = () => setoffCanvasShow(!offCanvasShow)
//   const canvasBody = () => {
//     return (
//       <>
//         hii
//       </>
//     )
//   }

//   return (
//     <>
//       <ButtonComponent
//         type={"button"}
//         className={"btn"}
//         clickFunction={handleCanvasOpenOrClose}
//         title="Launch"
//       />

//       <OffCanvas
//         offCanvasShow={offCanvasShow}

//         offcanvasClassname={"rounded-end-4 border-0"}
//         // offcanvasResponsive={"lg"}

//         handleCanvasOpenOrClose={handleCanvasOpenOrClose}
//         canvasBody={canvasBody()}
//       />
//     </>
//   );