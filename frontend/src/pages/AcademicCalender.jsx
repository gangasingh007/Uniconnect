import React from 'react'
import academicCalendarPDF from "../assets/AC.pdf";

const AcademicCalender = () => {
  return (
    <div>
        <embed src={academicCalendarPDF} type='applicartion/pdf' style={{width: "100%", height: "100vh"}}></embed>
    </div>
  )
}

export default AcademicCalender