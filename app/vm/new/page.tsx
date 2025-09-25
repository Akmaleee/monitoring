import { VmForm } from "./vm-form";

export default function NewVmPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Virtual Machine</h1>
          <p className="text-muted-foreground">
            Fill out the form below to provision a new VM.
          </p>
        </div>
        <VmForm />
      </div>
    </div>
  );
}