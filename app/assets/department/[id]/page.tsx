'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Asset, Department } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';

export default function DepartmentAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const params = useParams();
  const departmentId = params.id;
  const [search, setSearch] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(search.toLowerCase()) ||
    asset.type.toLowerCase().includes(search.toLowerCase()) ||
    asset.location.toLowerCase().includes(search.toLowerCase()) ||
    asset.status.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchDepartmentAssets = async () => {
      const assetsResponse = await fetch(`/api/assets?departmentId=${departmentId}`);
      const assetsData = await assetsResponse.json();
      setAssets(assetsData);

      const departmentResponse = await fetch(`/api/departments/${departmentId}`);
      const departmentData = await departmentResponse.json();
      setDepartment(departmentData);
    };

    fetchDepartmentAssets();
  }, [departmentId]);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>
      <h1 className="text-2xl font-bold mb-4 pt-20">
        {department ? `${department.name} Assets` : 'Department Assets'}
      </h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>
      <Table> 
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Last Maintenance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
              <TableCell>{asset.lastMaintenance ? new Date(asset.lastMaintenance).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{asset.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}