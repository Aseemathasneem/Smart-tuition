import React, { useEffect, useState } from "react";
import { Table, Card } from "flowbite-react";
import { apiCall } from '../../api/apiCalls'; 
import endpoints from '../../api/endpoints';

export default function PaymentDetailsTable() {
  const [paymentDetails, setPaymentDetails] = useState([]);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await apiCall('get', endpoints.GET_ALL_PAYMENT_DETAILS); // Endpoint to fetch payment details for admin
        setPaymentDetails(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchPaymentDetails();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <Card className="mt-6 shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Payment Summary</h2>
      <Table className="min-w-full divide-y divide-gray-200">
        <Table.Head>
          <Table.HeadCell>Session Date</Table.HeadCell>
          <Table.HeadCell>Student Name</Table.HeadCell>
          <Table.HeadCell>Tutor Name</Table.HeadCell>
          <Table.HeadCell>Tutoring Fee</Table.HeadCell>
          <Table.HeadCell>Platform Fee</Table.HeadCell>
          <Table.HeadCell>Total Amount</Table.HeadCell>
          <Table.HeadCell>Payment Status</Table.HeadCell>
        </Table.Head>
        <Table.Body className="bg-white divide-y divide-gray-200">
          {paymentDetails.map((detail, index) => (
            <Table.Row key={index} className="hover:bg-gray-100">
              <Table.Cell className="px-6 py-4 whitespace-nowrap">{formatDate(detail.sessionDate)}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">{detail.studentName}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">{detail.tutorName}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">{detail.tutoringFee}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">{detail.platformFee}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">{detail.totalAmount}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">{detail.paymentStatus}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
