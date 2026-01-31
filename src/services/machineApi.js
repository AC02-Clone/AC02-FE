import { getToken } from "./authApi";

const API_BASE_URL = "https://ac-02-be.vercel.app";

export const getAllMachines = async (page = 1, limit = 10) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/machines?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch machines");
    }

    return {
      machines: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Get Machines Error:", error);
    throw error;
  }
};

export const searchMachines = async (searchTerm, page = 1, limit = 10) => { 
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const query = encodeURIComponent(searchTerm);
    const url = `${API_BASE_URL}/api/machines/search?name=${query}&page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Failed to search machines for query: ${query}`);
    }

    // console.log("FINAL URL CHECK:", API_BASE_URL);
    // console.log("SEARCH API RESULT LENGTH:", machines.length);

    return {
      machines: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (err) {
    console.error("Search Machines Error:", err);
    throw err;
  }
};

// filter machine by type
export const filterMachinesByType = async (filter, page = 1, limit = 10) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/api/machines/type/${filter}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to filter machines");
    }

    return {
      machines: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Filter Machines Error:", error);
    throw error;
  }
};

// filter machines by risk
export const filterMachinesByRisk = async (risk, page = 1, limit = 10) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/api/machines/risk/${risk}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to filter machines by risk");
    }

    return {
      machines: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Filter Machines By Risk Error:", error);
    throw error;
  }
};

// filter machines by severity
export const filterMachinesBySeverity = async (severity, page = 1, limit = 10) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/api/machines/severity/${severity}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to filter machines by severity");
    }

    return {
      machines: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Filter Machines By Severity Error:", error);
    throw error;
  }
};

export const getMachineById = async (id) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/api/machines/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch machine");
    }

    const machine = data.data || data;

    if (Array.isArray(machine)) {
      return machine[0];
    }

    return machine;
  } catch (error) {
    console.error("Get Machine By ID Error:", error);
    throw error;
  }
};

// Maybe Not Used but keeping for future reference
export const createMachine = async (machineData) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/machines`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machineData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create machine");
    }

    return data;
  } catch (error) {
    console.error("Create machine error:", error);
    throw error;
  }
};

// Update machine
export const updateMachine = async (id, machineData) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machineData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update machine");
    }

    return data;
  } catch (error) {
    console.error("Update machine error:", error);
    throw error;
  }
};

// Delete machine
export const deleteMachine = async (id) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete machine");
    }

    return data;
  } catch (error) {
    console.error("Delete machine error:", error);
    throw error;
  }
};

export const getMachineStatistics = async () => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/api/machines/statistics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch machine statistics");
    }

    return data.data || data;
  } catch (error) {
    console.error("Get Machine Statistics Error:", error);
    throw error;
  }
};
