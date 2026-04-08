import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventAPI } from '../api/endpoints.js';

const initialState = {
  events: [],
  myEvents: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 12,
  },
};

export const getAllEvents = createAsyncThunk(
  'event/getAllEvents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getAllEvents(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const getEventById = createAsyncThunk(
  'event/getEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getEventById(eventId);
      return response.data.data.event;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (data, { rejectWithValue }) => {
    try {
      const response = await eventAPI.createEvent(data);
      return response.data.data.event;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Events
    builder
      .addCase(getAllEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Event By ID
    builder
      .addCase(getEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Event
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myEvents.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = eventSlice.actions;
export default eventSlice.reducer;
