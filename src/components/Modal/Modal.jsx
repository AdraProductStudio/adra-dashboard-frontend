import ButtonComponent from 'components/Button/Button';
import Modal from 'react-bootstrap/Modal';

const ModalComponent = ({
  rootComponent,

  modalSize,
  modalClassname,
  modalDialogClassName,
  modalFullscreen,
  modalCentered,
  modalHeaderClassname,
  modalHeader,

  modalBodyClassname,
  modalBody,

  modalShow,
  handleModel,

  modalFooterClassname,
  handleSubmitModel,
  closeBtn,
  closeBtnClassName,
  saveBtn,
  saveBtnClassName
}) => {

  return (
    <Modal
      show={modalShow}
      size={modalSize}
      fullscreen={modalFullscreen}
      centered={modalCentered}
      contentClassName={modalClassname}
      dialogClassName={modalDialogClassName}
      onHide={handleModel}
    >

      {/* Header */}
      <Modal.Header closeButton className={modalHeaderClassname}>
        <Modal.Title>
          {modalHeader}
        </Modal.Title>
      </Modal.Header>


      {/* Body */}
      <Modal.Body className={modalBodyClassname}>
        {modalBody}
      </Modal.Body>


      {/* Footer */}
      <Modal.Footer className={modalFooterClassname}>
        {
          closeBtn ?
            <div className="col">
              <ButtonComponent
                type="button"
                className={closeBtnClassName}
                clickFunction={handleModel}
                title="Close"
              />
            </div>
            :
            null
        }

        {
          saveBtn ?
            <div className="col">
              <ButtonComponent
                type="button"
                className={saveBtnClassName}
                clickFunction={handleSubmitModel}
                title="Save Changes"
              />
            </div>
            :
            null
        }
      </Modal.Footer>

    </Modal>
  )
}

export default ModalComponent


//how to use modal EXAMPLE:

// const [modalShow,setModalShow] = useState(true);
// const handleModel = () => setModalShow(!modalShow);
// const modalHedaerFun = () => {
//   return (
//     <span>asdiugaiusdd</span>
//   )
// }

// const modalBodyFun = () => {
//   return (
//     <div>
//       modal body
//     </div>
//   )
// }
// return (
//   <>
//     <MoModalComponentdal
//       modalClassname="bg-light"
//       modalSize="md"
//       modalCentered={true}
//       modalShow={modalShow}
//       handleModel={handleModel}
//       modalFullscreen={true}
//       // modalDialogClassName={"modal-90w"}
//       modalHeaderClassname="text-danger"
//       modalHeader={modalHedaerFun()}
//       modalBodyClassname="ps-4"
//       modalBody={modalBodyFun()}
//       modalFooterClassname="d-flex text-end"
//       closeBtn={true}
//       closeBtnClassName={"btn col-4"}
//       saveBtn={false}
//       saveBtnClassName={"btn w-100"}
//     />
//   </>
// );