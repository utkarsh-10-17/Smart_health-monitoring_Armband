import React, { useState, useEffect } from 'react';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import Header from '../components/Header';
import Card from '../components/Card';
import LineGraph from '../components/LineGraph';
import { Heart, Thermometer, MapPin, Coffee, AlertTriangle } from 'lucide-react';

// AWS DynamoDB configuration
const dynamoDBConfig = {
  region: 'eu-north-1',
  credentials: {
    accessKeyId: 'AKIAY5XNUOTT34PKIFNZ',
    secretAccessKey: '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',
  }
};

const client = new DynamoDBClient(dynamoDBConfig);
const docClient = DynamoDBDocumentClient.from(client);

interface HealthData {
  avg_hr_this_minute: number;
  avg_spo2_this_minute: number;
  min_spo2_this_minute: number;
  latitude: number;
  longitude: number;
  location_name: string;
  temperature_celsius: number;
  timestamp: string;
  spo2_alert_status: string;
  temp_alert_status: string;
}

interface ECGData {
  ecgSeries: number[];
  timestamp: string;
}

interface NFCData {
  itemName: string;
  itemType: string;
  timestamp: string;
}

const AnalysisPage: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState('PatientDemo001');
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [ecgData, setEcgData] = useState<ECGData | null>(null);
  const [nfcData, setNfcData] = useState<NFCData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch HealthData
        const healthResponse = await docClient.send(new QueryCommand({
          TableName: 'HealthData',
          KeyConditionExpression: 'PatientID = :pid',
          ExpressionAttributeValues: {
            ':pid': selectedPatient
          },
          ScanIndexForward: false, // Sort in descending order (latest first)
          Limit: 1 // Get only the latest record
        }));

        if (healthResponse.Items?.[0]) {
          setHealthData(healthResponse.Items[0] as HealthData);
        }

        // Fetch ECGData
        let ecgResponse = await docClient.send(new QueryCommand({
          TableName: 'ECGData',
          KeyConditionExpression: 'PatientID = :pid',
          ExpressionAttributeValues: {
            ':pid': selectedPatient
          },
          ScanIndexForward: false,
          Limit: 1
        }));

        if (ecgResponse.Items?.[0]) {
          ecgResponse.Items[0].ecgSeries = ecgResponse.Items[0].ecgSeries.split(',').map(Number);
          setEcgData(ecgResponse.Items[0] as ECGData);
        }

        // Fetch NFCData
        const nfcResponse = await docClient.send(new QueryCommand({
          TableName: 'NFCData',
          KeyConditionExpression: 'PatientID = :pid',
          ExpressionAttributeValues: {
            ':pid': selectedPatient
          },
          ScanIndexForward: false,
          Limit: 1
        }));

        if (nfcResponse.Items?.[0]) {
          setNfcData(nfcResponse.Items[0] as NFCData);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch patient data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPatient]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white rounded-full shadow-soft p-1 inline-flex">
            <button
              className={`px-6 py-2 rounded-full transition-all ${
                selectedPatient === 'PatientDemo001'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setSelectedPatient('PatientDemo001')}
            >
              Patient 001
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all ${
                selectedPatient === 'PatientDemo002'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setSelectedPatient('PatientDemo002')}
            >
              Patient 002
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vital Signs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
                <div className="flex items-start">
                  <div className="p-3 bg-primary-500 rounded-lg mr-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-primary-900 text-sm font-medium">Heart Rate</p>
                    <h4 className="text-2xl font-semibold text-primary-900 mt-1">
                      {healthData?.avg_hr_this_minute} BPM
                    </h4>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200">
                <div className="flex items-start">
                  <div className="p-3 bg-secondary-500 rounded-lg mr-4">
                    <Thermometer className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-secondary-900 text-sm font-medium">Body Temperature</p>
                    <h4 className="text-2xl font-semibold text-secondary-900 mt-1">
                      {healthData?.temperature_celsius.toFixed(1)}°C
                    </h4>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 col-span-2">
                <div className="flex items-start">
                  <div className="p-3 bg-accent-500 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-accent-900 text-sm font-medium">Current Location</p>
                    <h4 className="text-xl font-semibold text-accent-900 mt-1">
                      {healthData?.location_name}
                    </h4>
                    <p className="text-accent-700 text-sm mt-1">
                      {healthData?.latitude.toFixed(4)}, {healthData?.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* SpO2 Readings */}
            <Card title="Blood Oxygen Levels">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm font-medium">Average SpO2</p>
                  <h4 className="text-2xl font-semibold text-green-900 mt-1">
                    {healthData?.avg_spo2_this_minute}%
                  </h4>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm font-medium">Minimum SpO2</p>
                  <h4 className="text-2xl font-semibold text-blue-900 mt-1">
                    {healthData?.min_spo2_this_minute}%
                  </h4>
                </div>
              </div>
            </Card>
            
            {/* ECG Graph */}
            <Card title="ECG Readings">
              <LineGraph 
                data={ecgData?.ecgSeries || []}
                color="#0ea5e9"
                name="ECG"
                height={300}
              />
            </Card>

            {/* Alerts Section */}
            <Card title="Health Alerts">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg border flex items-start space-x-4 ${
                  healthData?.spo2_alert_status === 'Normal' 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200' 
                }`}>
                  <div className={`p-2 rounded-full ${
                    healthData?.spo2_alert_status === 'Normal' 
                      ? 'bg-green-100'
                      : 'bg-red-100' 
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      healthData?.spo2_alert_status === 'Normal' 
                        ? 'text-green-600'
                        : 'text-red-600' 
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      healthData?.spo2_alert_status === 'Normal' 
                        ? 'text-green-800'
                        : 'text-red-800' 
                    }`}>SpO2 Status</p>
                    <p className={`text-sm mt-1 ${
                      healthData?.spo2_alert_status === 'Normal' 
                        ? 'text-green-600'
                        : 'text-red-600' 
                    }`}>
                      {healthData?.spo2_alert_status === 'Normal' ? 'Normal' : 'Alert: Low oxygen levels'}
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border flex items-start space-x-4 ${
                  healthData?.temp_alert_status === 'Normal' 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200' 
                }`}>
                  <div className={`p-2 rounded-full ${
                    healthData?.temp_alert_status === 'Normal' 
                      ? 'bg-green-100'
                      : 'bg-red-100' 
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      healthData?.temp_alert_status === 'Normal' 
                        ? 'text-green-600'
                        : 'text-red-600' 
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      healthData?.temp_alert_status === 'Normal' 
                        ? 'text-green-800'
                        : 'text-red-800' 
                    }`}>Temperature Status</p>
                    <p className={`text-sm mt-1 ${
                      healthData?.temp_alert_status === 'Normal' 
                        ? 'text-green-600'
                        : 'text-red-600' 
                    }`}>
                      {healthData?.temp_alert_status === 'Normal' ?  'Normal' : 'Alert: Temperature out of range'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Last Consumed Item */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <div className="flex items-start">
                <div className="p-3 bg-gray-500 rounded-lg mr-4">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-medium">Last Consumed Item</p>
                  <h4 className="text-xl font-semibold text-gray-900 mt-1">
                    {nfcData?.itemName}
                  </h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Type: {nfcData?.itemType}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalysisPage;