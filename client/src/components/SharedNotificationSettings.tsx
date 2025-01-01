"use client"
import { NotificationSettingsFormData, notificationSettingsSchema } from "@/lib/schemas";
import { useUpdateUserMutation } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import React from "react";
import {  useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Header from "./Header";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "./CustomFormField";

const SharedNotificationSettings = ({
  title = "Notifications Settings",
  subtitle = "Manage your notification settings"
}: SharedNotificationSettingsProps) => {
  const { user } = useUser();
  const [updateUser] = useUpdateUserMutation();
  const currentSettings = (user?.publicMetadata as {settings?: UserSettings})?.settings || {};
  const methods = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
        courseNotifications: currentSettings.courseNotifications || false,
        emailAlerts: currentSettings.emailAlerts || false,
        smsAlerts: currentSettings.smsAlerts || false,
        notificationFrequency: currentSettings.notificationFrequency || "daily"
    }
  })
  const onSubmit = async (data: NotificationSettingsFormData) => {
    if(!user) return;

    const updateUser = {
        userId: user.id,
        publicMetadata: {
            ...user.publicMetadata,
            settings: {
                ...currentSettings,
                ...data,
            }
        }
    }
    try{
        await updateUser(udpatedUser);
    }catch (error){
        console.error("Failed to update user settings", error)
    }
  };
  if(!user) return <div>Please sign in to manage your settings.</div>
  return <div className="notifcations-settings">
    <Header title={title} subtitle={subtitle} />
    <Form {...methods}>
        <form action="" onSubmit={methods.handleSubmit(onSubmit)}
        className="notifications-settings__form">
            <div className="notifications-settings__fields">
                <CustomFormField name="courseNotifications"
                label="Course Notifications"
                type="switch"></CustomFormField>
            </div>
        </form>
    </Form>
  </div>;
};

export default SharedNotificationSettings;
