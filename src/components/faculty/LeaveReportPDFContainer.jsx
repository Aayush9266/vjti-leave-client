import React, { useEffect, useState } from "react";
import LeaveReportPDF from "./LeaveReportPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import vjtilogo from "@/assets/vjtilogo.png";

const LeaveReportPDFContainer = ({ facultyId, month }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('LeaveReportPDFContainer: facultyId:', facultyId, 'month:', month);
    if (!facultyId || !month) {
      setError('Faculty ID or month is missing.');
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/faculty/leave-report?facultyId=${facultyId}&month=${month}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch data");
        }
        const result = await response.json();
        result.logoSrc = vjtilogo;
        setData(result);
      } catch (err) {
        setError(err.message || "Error fetching data");
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [facultyId, month]);

  if (!facultyId || !month) return <div>Faculty ID or month is missing.</div>;
  if (loading) return <div>Loading leave report...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <PDFDownloadLink
      document={
        <LeaveReportPDF
          facultyInfo={data.facultyInfo}
          leaveSummary={data.leaveSummary}
          leaveLog={data.leaveLog}
          reportMonth={data.reportMonth}
          reportGenerationDate={data.reportGenerationDate}
          generatedBy={data.generatedBy}
          department={data.department}
          logoSrc={data.logoSrc}
        />
      }
      fileName={`LeaveReport_${data.facultyInfo?.id || facultyId}_${data.reportMonth || month}.pdf`}
    >
      {({ loading }) =>
        loading ? "Generating PDF..." : "Download Leave Report PDF"
      }
    </PDFDownloadLink>
  );
};

export default LeaveReportPDFContainer; 