import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Image } from '@react-pdf/renderer';

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
    headerText: {
    fontWeight: "normal",
    marginBottom: 2,
    fontFamily: "Helvetica",
    lineHeight: 1.2,
  },
  
    headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  
  logoContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  
  headerTextContainer: {
    width: "75%",
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
    textDecoration: "underline",
  },
  section: {
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  text: {
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 4,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  col: {
    flex: 1,
    paddingRight: 5,
  },
  footer: {
    marginTop: 30,
    textAlign: "right",
    fontSize: 11,
  },
});

// PDF content component
const LeaveReportPDF = ({
  facultyInfo = {},
  leaveSummary = {},
  leaveLog = [],
  reportMonth = "",
  reportGenerationDate = "",
  generatedBy = "",
  department = "",
  logoSrc = ""
}) => (
  <Document>
    <Page style={styles.page}>
      {/* Header with logo and text */}
      <View style={styles.headerContainer}>
        {/* Left: Logo */}
        <View style={styles.logoContainer}>
          {logoSrc && <Image src={logoSrc} style={styles.logo} />}
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Leave Report – {reportMonth}</Text>
        <Text>Date of Report Generation: {reportGenerationDate}</Text>
      </View>

      {/* Faculty Info */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Faculty Information</Text>
        <Text style={styles.text}>Faculty Name: {facultyInfo.name}</Text>
        <Text style={styles.text}>Faculty ID: {facultyInfo.id}</Text>
        <Text style={styles.text}>Department: {department}</Text>
        <Text style={styles.text}>Designation: {facultyInfo.designation}</Text>
      </View>

      {/* Leave Summary */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Leave Summary</Text>
        {leaveSummary.types && leaveSummary.types.map((type, idx) => (
          <Text key={idx} style={styles.text}>
            · {type.name}: {type.count} times (Total {type.days} days)
          </Text>
        ))}
        <Text style={{ marginTop: 5 }}>
          Total Leaves Taken: {leaveSummary.totalLeaves} approved leaves, covering a total of {leaveSummary.totalDays} days.
        </Text>
      </View>

      {/* Detailed Log */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Detailed Leave Log</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.col}>Leave Type</Text>
          <Text style={styles.col}>From</Text>
          <Text style={styles.col}>To</Text>
          <Text style={styles.col}>Days</Text>
          <Text style={styles.col}>Approved By</Text>
          <Text style={styles.col}>Approval Date</Text>
        </View>
        {leaveLog.map((entry, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.col}>{entry.type}</Text>
            <Text style={styles.col}>{entry.from}</Text>
            <Text style={styles.col}>{entry.to}</Text>
            <Text style={styles.col}>{entry.days}</Text>
            <Text style={styles.col}>{entry.approver}</Text>
            <Text style={styles.col}>{entry.date}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generated on {reportGenerationDate} by {generatedBy}
      </Text>
    </Page>
  </Document>
);

export default LeaveReportPDF;
