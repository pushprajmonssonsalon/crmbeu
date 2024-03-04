import React from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import Layout from '../../components/Layout';

export default function CompletedAppointment() {
  const csvData = [
    { firstname: 'Ahmed', lastname: 'Tomi', email: 'ah@smthing.co.com' },
    { firstname: 'Raed', lastname: 'Labes', email: 'rl@smthing.co.com' },
    { firstname: 'Yezzi', lastname: 'Min l3b', email: 'ymin@cocococo.com' },
  ];

  return (
    <Layout>
    <div className='mt-32'>
      <CSVLink data={csvData}>Download me</CSVLink>
    </div>
    </Layout>
  );
}
