import React, { useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { Form as FormAntd, Input, Modal } from "antd";
import Title from "./Component/Title";
import TextAreaInput from "./Component/TextAreaInput";
import ModalLampiran from "./Component/ModalLampiran";

const PerubahanKlausul = () => {
  const [form] = FormAntd.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lampiranItems, setLampiranItems] = useState([]);

  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Title
        title="C. Perubahan Klausul Kontrak Harga Pekerjaan"
        marginTop={-8}
      />
      <Form.Label>
        <Title title="C.1 Body Kontrak" required={true} />
      </Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="Masukan Nomor Pasal"
        className="mb-3"
        style={{ border: "1px solid black", width: "40%" }}
      />
      <div className="pasal-sebelum-adendum">
        <Form.Label>
          <Title title="Pasal Sebelum Addendum" required={true} />
        </Form.Label>
        <TextAreaInput />
      </div>
      <div className="pasal-setelah-adendum">
        <Form.Label>
          <Title title="Pasal Setelah Addendum" required={true} />
        </Form.Label>
        <TextAreaInput />
      </div>
      <div className="lampiran">
        <Form.Label>
          <Title title="C.2 Lampiran" required={true} />
        </Form.Label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControl
            required
            type="text"
            placeholder="Masukan Nomor Lampiran"
            style={{ border: "1px solid black", width: "40%" }}
            className="mb-3"
          />
          <div
            style={{
              display: "flex",
              gap: 14,
            }}
          >
            <button
              type="button"
              className="btn btn-primary text-white"
              onClick={showModal}
            >
              Tambah Klausul Lampiran nya
            </button>
          </div>
        </div>
        <TextAreaInput />
      </div>

      {/* Render Lampiran Items */}
      <div>
        {lampiranItems.map((item, index) => (
          <div key={index}>
            <FormControl
              required
              type="text"
              defaultValue={item.angkaLampiran}
              placeholder="Masukan Nomor Lampiran"
              style={{ border: "1px solid black", width: "100%" }}
              className="mb-3"
            />
            <TextAreaInput defaultValue={item.isiPerubahanKlausul} />
          </div>
        ))}
      </div>

      <ModalLampiran
        isModalOpen={isModalOpen}
        showModal={showModal}
        form={form}
        setLampiranItems={setLampiranItems}
        lampiranItems={lampiranItems}
      />
    </>
  );
};

export default PerubahanKlausul;
