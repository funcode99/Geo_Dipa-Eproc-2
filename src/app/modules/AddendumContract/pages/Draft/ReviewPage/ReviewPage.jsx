import React, { useState } from "react";
import ReviewerPage from "./ReviewerPage";
import ProsesReviewPage from "./ProsesReviewPage";

const ReviewPage = ({ isAdmin, isVendor, isClient, contract_id }) => {
  const [reviewSequence, setReviewSequence] = React.useState(0);

  const HeaderSection = () => {
    return (
      <>
        <div
          style={{
            height: 74,
            fontSize: 14,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: reviewSequence === 0 ? "#3699ff" : "white",
              color: reviewSequence === 0 ? "white" : "black",
              flexGrow: 1,
              borderTopLeftRadius: 14,
              cursor: "pointer",
            }}
            onClick={() => setReviewSequence(0)}
          >
            <h1
              style={{
                fontSize: 14,
              }}
            >
              Reviewer
            </h1>
          </div>

          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: reviewSequence === 1 ? "#3699ff" : "white",
              color: reviewSequence === 1 ? "white" : "black",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => setReviewSequence(1)}
          >
            <h1
              style={{
                fontSize: 14,
              }}
            >
              Proses Review
            </h1>
          </div>

          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: reviewSequence === 2 ? "#3699ff" : "white",
              color: reviewSequence === 2 ? "white" : "black",
              flexGrow: 1,
              borderTopRightRadius: 14,
              cursor: "pointer",
            }}
            onClick={() => setReviewSequence(2)}
          >
            <h1
              style={{
                fontSize: 14,
              }}
            >
              Final Draft
            </h1>
          </div>
        </div>
      </>
    );
  };

  switch (reviewSequence) {
    case 0:
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: 28,
            marginTop: 24,
            marginBottom: 24,
            borderRadius: 5,
          }}
        >
          <HeaderSection />
          <ReviewerPage
            isAdmin={isAdmin}
            isVendor={isVendor}
            isClient={isClient}
            contract_id={contract_id}
          />
        </div>
      );
    case 1:
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: 28,
            marginTop: 24,
            marginBottom: 24,
            borderRadius: 5,
          }}
        >
          <HeaderSection />
          <ProsesReviewPage contract_id={contract_id} />
        </div>
      );
    default:
      return (
        <>
          <HeaderSection />
          <p>hello wolrd</p>
        </>
      );
  }
};

export default ReviewPage;
