import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy"; 
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createCoupon } from "../../../Redux Toolkit/Admin/AdminCouponSlice";

// Interface for the form values remains the same.
interface CouponFormValues {
  code: string;
  discountPercentage: number;
  validityStartDate: Dayjs | null;
  validityEndDate: Dayjs | null;
  minimumOrderValue: number;
}

const CouponForm: React.FC = () => {
  const dispatch = useAppDispatch();
  // ✅ FIX: Removed the unused 'coupone' variable.
  const { adminCoupon } = useAppSelector((store) => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const formik = useFormik<CouponFormValues>({
    initialValues: {
      code: "",
      discountPercentage: 0,
      validityStartDate: null,
      validityEndDate: null,
      minimumOrderValue: 0,
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required("Coupon code is required")
        .min(3, "Code should be at least 3 characters")
        .max(20, "Code should be at most 20 characters"),
      discountPercentage: Yup.number()
        .required("Discount percentage is required")
        .min(1, "Discount should be at least 1%")
        .max(100, "Discount cannot exceed 100%"),
      validityStartDate: Yup.date()
        .nullable()
        .required("Start date is required")
        .typeError("Invalid date format"), // Improved error message
      validityEndDate: Yup.date()
        .nullable()
        .required("End date is required")
        .typeError("Invalid date format") // Improved error message
        .min(
          Yup.ref("validityStartDate"),
          "End date cannot be before the start date"
        ),
      minimumOrderValue: Yup.number()
        .required("Minimum order value is required")
        .min(1, "Minimum order value should be at least 1"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const formattedValues = {
        ...values,
        validityStartDate: values.validityStartDate
          ? values.validityStartDate.toISOString()
          : null,
        validityEndDate: values.validityEndDate
          ? values.validityEndDate.toISOString()
          : null,
      };
      
      dispatch(
        createCoupon({
          coupon: formattedValues,
          jwt: localStorage.getItem("jwt") || "",
        })
      );
      // ✅ Best Practice: Reset form on successful submission
      if (!adminCoupon.error) {
          resetForm();
      }
      setSubmitting(false);
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // ✅ FIX: Snackbar now opens on both success and error for better user feedback.
  useEffect(() => {
    if (adminCoupon.couponCreated || adminCoupon.error) {
      setOpenSnackbar(true);
    }
  }, [adminCoupon.couponCreated, adminCoupon.error]);

  return (
    <div className="max-w-3xl">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}> {/* Grid2 container */}
            <Grid xs={12} sm={6}> {/* No 'item' prop needed with Grid2 */}
              <TextField
                fullWidth
                id="code"
                name="code"
                label="Coupon Code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                id="discountPercentage"
                name="discountPercentage"
                label="Discount Percentage"
                type="number"
                value={formik.values.discountPercentage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.discountPercentage &&
                  Boolean(formik.errors.discountPercentage)
                }
                helperText={
                  formik.touched.discountPercentage &&
                  formik.errors.discountPercentage
                }
              />
            </Grid>
            {/* ✅ FIX: DatePickers now correctly show validation errors from Formik */}
            <Grid xs={12} sm={6}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Validity Start Date"
                value={formik.values.validityStartDate}
                onChange={(date) =>
                  formik.setFieldValue("validityStartDate", date)
                }
                // This connects the DatePicker to Formik's validation
                slotProps={{
                  textField: {
                    onBlur: formik.handleBlur,
                    error: formik.touched.validityStartDate && Boolean(formik.errors.validityStartDate),
                    helperText: formik.touched.validityStartDate && formik.errors.validityStartDate,
                  },
                }}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Validity End Date"
                value={formik.values.validityEndDate}
                onChange={(date) =>
                  formik.setFieldValue("validityEndDate", date)
                }
                // This connects the DatePicker to Formik's validation
                slotProps={{
                  textField: {
                    onBlur: formik.handleBlur,
                    error: formik.touched.validityEndDate && Boolean(formik.errors.validityEndDate),
                    helperText: formik.touched.validityEndDate && formik.errors.validityEndDate,
                  },
                }}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                id="minimumOrderValue"
                name="minimumOrderValue"
                label="Minimum Order Value"
                type="number"
                value={formik.values.minimumOrderValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.minimumOrderValue &&
                  Boolean(formik.errors.minimumOrderValue)
                }
                helperText={
                  formik.touched.minimumOrderValue &&
                  formik.errors.minimumOrderValue
                }
              />
            </Grid>
            <Grid xs={12}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                sx={{ mt: 2, py: 1.5 }} // Increased padding for a better look
                fullWidth
                disabled={adminCoupon.loading || formik.isSubmitting}
              >
                {adminCoupon.loading ? (
                  <CircularProgress
                    size={24} // Standard size for buttons
                  />
                ) : (
                  "Create Coupon"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={adminCoupon.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {adminCoupon.error ? adminCoupon.error : "Coupon created successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CouponForm;