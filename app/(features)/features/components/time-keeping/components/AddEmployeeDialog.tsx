"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface EmployeeFormData {
  name: string;
  phone: string;
  role: string;
}

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (employees: EmployeeFormData[], branchId: string) => void;
}

const ROLES = [
  { value: "Nhân viên", label: "Nhân viên" },
  { value: "Quản lý", label: "Quản lý" },
  { value: "Quản lý chi nhánh", label: "Quản lý chi nhánh" },
  { value: "Quản lý vùng", label: "Quản lý vùng" },
];

// Mock branch data - replace with actual data
const BRANCHES = [
  { id: "branch-1", name: "Chi nhánh Hồ Chí Minh" },
  { id: "branch-2", name: "Chi nhánh Hà Nội" },
  { id: "branch-3", name: "Chi nhánh Đà Nẵng" },
];

export default function AddEmployeeDialog({
  open,
  onOpenChange,
  onAdd,
}: AddEmployeeDialogProps) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [employees, setEmployees] = useState<EmployeeFormData[]>([
    { name: "", phone: "", role: "Nhân viên" },
  ]);

  const addNewEmployeeRow = () => {
    setEmployees([...employees, { name: "", phone: "", role: "Nhân viên" }]);
  };

  const removeEmployeeRow = (index: number) => {
    if (employees.length > 1) {
      setEmployees(employees.filter((_, i) => i !== index));
    }
  };

  const updateEmployee = (
    index: number,
    field: keyof EmployeeFormData,
    value: string
  ) => {
    const updated = [...employees];
    updated[index] = { ...updated[index], [field]: value };
    setEmployees(updated);
  };

  const handleSubmit = () => {
    const validEmployees = employees.filter(
      (emp) => emp.name.trim() !== "" && emp.phone.trim() !== ""
    );
    if (validEmployees.length > 0 && selectedBranch) {
      onAdd(validEmployees, selectedBranch);
      // Reset form
      setEmployees([{ name: "", phone: "", role: "Nhân viên" }]);
      setSelectedBranch("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setEmployees([{ name: "", phone: "", role: "Nhân viên" }]);
    setSelectedBranch("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm nhân viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Branch Selection */}
          <div className="space-y-2">
            <Label>Chi nhánh</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                {BRANCHES.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee List */}
          <div className="space-y-3">
            <Label>Danh sách nhân viên</Label>
            {employees.map((employee, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
              >
                <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                  <div>
                    <Input
                      placeholder="Tên nhân viên"
                      value={employee.name}
                      onChange={(e) =>
                        updateEmployee(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Số điện thoại"
                      value={employee.phone}
                      onChange={(e) =>
                        updateEmployee(index, "phone", e.target.value)
                      }
                    />
                  </div>
                  <Select
                    value={employee.role}
                    onValueChange={(value) =>
                      updateEmployee(index, "role", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:text-red-500"
                  onClick={() => removeEmployeeRow(index)}
                  disabled={employees.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add More Button */}
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={addNewEmployeeRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm nhân viên
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            className="bg-[#8f58e4] hover:bg-[#402093]"
            onClick={handleSubmit}
            disabled={!selectedBranch}
          >
            Thêm nhân viên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
