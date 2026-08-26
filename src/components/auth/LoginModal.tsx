import React, { useState } from 'react';
import { Lock, ArrowRight, User } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Logo } from '../layout/Logo';
import { Button } from '../ui/Button';

export const LoginModal: React.FC = () => {
  const { currentRole, loginAsStudent, student } = useAcademic();
  const [studentIdInput, setStudentIdInput] = useState(student.studentId || 'CIS231475');
  const [passwordInput, setPasswordInput] = useState('academic2026');
  const [errorMsg, setErrorMsg] = useState('');

  if (currentRole !== 'guest') return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Please enter your Student ID and password.');
      return;
    }
    const success = loginAsStudent(studentIdInput, passwordInput);
    if (!success) {
      setErrorMsg('Invalid student credentials. Use CIS231475.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FFFDF5] dark:bg-[#151513] animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] shadow-xl p-8 space-y-6 text-center">
        {/* Logo & Title */}
        <div className="flex flex-col items-center space-y-2">
          <Logo showSubtitle={false} />
          <h2 className="font-editorial text-2xl font-bold text-[#171714] dark:text-[#F7F3E8] pt-2">
            Personal Academic OS
          </h2>
          <p className="text-xs text-[#66645C] dark:text-[#B9B3A4]">
            Private academic memory vault for {student.fullName}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-left text-xs">
          {errorMsg && (
            <div className="p-2 rounded-lg bg-[#9B3D32]/10 border border-[#9B3D32]/30 text-[#9B3D32] dark:text-[#B85246] text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
              Student ID
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#66645C] dark:text-[#B9B3A4]" />
              <input
                type="text"
                required
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] dark:focus:border-[#D4AF37] outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
              Academic Passphrase
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#66645C] dark:text-[#B9B3A4]" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] dark:focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-full py-2.5 mt-2"
          >
            <span>Unlock Academic Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          <div className="pt-2 text-center text-[10px] text-[#66645C] dark:text-[#B9B3A4]">
            Encrypted with local zero-loss persistence
          </div>
        </form>
      </div>
    </div>
  );
};
