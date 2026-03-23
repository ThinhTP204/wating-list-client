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
import { Building2, Plus, Trash2, UserPlus } from "lucide-react";

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
          <DialogTitle className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#402093] to-[#8f58e4] flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5 text-white" />
            </div>
            Thêm nhân viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Branch Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Chi nhánh
            </Label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8f58e4]/10 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[#8f58e4]" />
              </div>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="flex-1 focus:ring-[#8f58e4]/30">
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
          </div>

          {/* Employee List */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Danh sách nhân viên
            </Label>
            <div className="space-y-2">
              {employees.map((employee, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700"
                >
                  {/* Index badge */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8f58e4] to-[#402093] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <Input
                      placeholder="Tên nhân viên"
                      value={employee.name}
                      onChange={(e) => updateEmployee(index, "name", e.target.value)}
                      className="h-8 text-sm focus-visible:ring-[#8f58e4]/30"
                    />
                    <Input
                      placeholder="Số điện thoại"
                      value={employee.phone}
                      onChange={(e) => updateEmployee(index, "phone", e.target.value)}
                      className="h-8 text-sm focus-visible:ring-[#8f58e4]/30"
                    />
                    <Select
                      value={employee.role}
                      onValueChange={(value) => updateEmployee(index, "role", value)}
                    >
                      <SelectTrigger className="h-8 text-sm focus:ring-[#8f58e4]/30">
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
                    className="h-7 w-7 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                    onClick={() => removeEmployeeRow(index)}
                    disabled={employees.length === 1}
                    aria-label="Xóa nhân viên"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add More Button */}
          <Button
            variant="outline"
            className="w-full border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-500 hover:text-[#8f58e4] hover:border-[#8f58e4] hover:bg-[#8f58e4]/5 transition-all"
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
            className="bg-[#8f58e4] hover:bg-[#402093] hover:shadow-md text-white transition-all"
            onClick={handleSubmit}
            disabled={!selectedBranch}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Thêm nhân viên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
