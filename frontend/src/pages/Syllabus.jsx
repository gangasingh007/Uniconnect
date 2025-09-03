import React from "react";
import syllabusPDF from "../assets/syllabus.pdf";

const Syllabus = () => {
  return (
    <div>
      <embed
        src={syllabusPDF}
        type="application/pdf"
        style={{ width: "100%", height: "100vh" }}
      />
    </div>
  );
};

export default Syllabus;