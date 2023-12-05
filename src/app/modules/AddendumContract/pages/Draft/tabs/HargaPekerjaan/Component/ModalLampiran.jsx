import React from "react";
import { Form, Input, Modal } from "antd";

const { TextArea } = Input;

const ModalLampiran = ({
  isModalOpen,
  showModal,
  form,
  setLampiranItems,
  lampiranItems,
}) => {
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setLampiranItems([...lampiranItems, values]);
        showModal();
        form.resetFields();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  const handleCancel = () => {
    showModal();
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Tambah Klausul Lampiran"
        visible={isModalOpen}
        onOk={handleOk}
        okText="Simpan"
        onCancel={handleCancel}
        cancelText="Batal"
      >
        <Form layout={"vertical"} form={form}>
          <Form.Item
            label="Angka Lampiran"
            name="angkaLampiran"
            rules={[{ required: true, message: "Wajib di isi!" }]}
          >
            <Input placeholder="masukan angka lampiran" type="number" min={0} />
          </Form.Item>
          <Form.Item
            label="Isi Perubahan Klausul"
            name="isiPerubahanKlausul"
            rules={[{ required: true, message: "Wajib di isi!" }]}
          >
            <TextArea rows={4} placeholder="masukan isi perubahan klausul" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalLampiran;
