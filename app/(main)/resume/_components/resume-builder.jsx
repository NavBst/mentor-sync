"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { saveResume } from "@/actions/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./entry-form";
import { entriesToMarkdown } from "@/app/lib/helper";
import { useUser } from "@clerk/nextjs";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";

const ResumeBuilder = ({ initialContent }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [resumeMode, setResumeMode] = useState("preview");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const resumePdfRef = useRef(null);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  const { user } = useUser();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linked) parts.push(`💼 [Linkedin](${contactInfo.linked})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div> \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : " ";
  };

  const getCombinedContent = () => {
    const { summary, skills, education, experience, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && ` ## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  useEffect(()=>{
    if(saveResult && !isSaving){
      toast.success("Resume saved successfully!");
    }
    if(saveError)
    {
      toast.error(saveError.message || "Failed to save resume");
    }

  }, [saveResult, saveError, isSaving]);

  const onSubmit = async () => {

    try {
      await saveResumeFn(previewContent);
      console.log("first")
    } catch (error) {
      console.error("Save Error: ", error)
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamically load the libraries only on the client
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.querySelector("#resume-pdf");
      console.log(element);
      if (!element) {
        throw new Error("Resume element not found");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
      pdf.save(`${user.firstName}_resume.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2 space-y-3">
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={isSaving}
          >
            {
              isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                </>
              )
              :
              (
              <>
                <Save className="h-4 w-4" />
                Save
              </>)
            }
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Pdf...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/60">
                <div className="space-y-2">
                  <label className="text-sm font-medium inline-block">
                    Email<sup className="text-red-700">*</sup>
                  </label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                    error={errors.contactInfo?.email}
                  />

                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium inline-block">
                    Mobile Number<sup className="text-red-700">*</sup>
                  </label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+91 867 238 9682"
                  />

                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium inline-block">
                    LinkedIn
                  </label>
                  <Input
                    {...register("contactInfo.linked")}
                    type="url"
                    placeholder="https://www.linkedin.com/in/your-profile/"
                    error={errors.contactInfo?.linked}
                  />

                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linked.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium inline-block">
                    Twitter
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle/"
                    error={errors.contactInfo?.twitter}
                  />

                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* professional summary  */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32 bg-muted/60"
                    placeholder="Write a compelling professional summary..."
                    error={errors.summary}
                  />
                )}
              />

              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>
            {/* skills  */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Skills<sup className="text-red-700">*</sup>
              </h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32 bg-muted/60"
                    placeholder="List your key skills..."
                    error={errors.skills}
                  />
                )}
              />

              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* expericence */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* education */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* projects  */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Projects"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
            type="button"
            variant="link"
            className="mb-2"
            onClick={() => {
              resumeMode === "preview"
                ? setResumeMode("edit")
                : setResumeMode("preview");
            }}
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="h-4 w-4" /> Edit resume
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4" />
                show preview
              </>
            )}
          </Button>
          {resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose edited markdown if you update the form data.
              </span>
            </div>
          )}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: "-9999px",
              top: 0,
              width: "210mm", // Standard A4 Width
            }}
          >
            <div id="resume-pdf">
              <div
                id="resume-pdf"
                className="resume-pdf-container"
                style={{
                  padding: "5mm 7mm", // This creates the 20mm margin on all sides
                  background: "white",
                  minHeight: "297mm", // Standard A4 height
                  boxSizing: "border-box", // Critical: ensures padding doesn't increase width
                  textAlign: "justify",
                }}
              >
                <MDEditor.Markdown
                  source={previewContent}
                  style={{ background: "white", color: "black" }}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
