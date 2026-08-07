import { type Page } from "@playwright/test";

/**
 * Sets up route mocks for Supabase Auth and Database endpoints
 * to keep E2E tests hermetic, fast, and independent of live backends.
 */
export async function setupAccountsApiMocks(page: Page, initialAccounts: any[] = []) {
  let currentAccounts = [...initialAccounts];

  await page.route("**/auth/v1/token*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mock-refresh-token",
        user: {
          id: "mock-user-id",
          email: "test@family.com",
          email_confirmed_at: new Date().toISOString(),
        },
      }),
    });
  });

  await page.route("**/auth/v1/user*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "mock-user-id",
        email: "test@family.com",
        email_confirmed_at: new Date().toISOString(),
      }),
    });
  });

  await page.route("**/rest/v1/users*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        first_name: "Test",
        last_name: "User",
        is_verified: true,
      }),
    });
  });

  await page.route("**/rest/v1/accounts*", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(currentAccounts),
      });
    } else if (method === "POST") {
      const postData = route.request().postDataJSON();
      const newAccount = {
        id: `mock-account-id-${currentAccounts.length + 1}`,
        name: Array.isArray(postData) ? postData[0]?.name : postData?.name,
        type: Array.isArray(postData) ? postData[0]?.type : postData?.type,
        balance: Number(Array.isArray(postData) ? postData[0]?.balance : postData?.balance),
        created_at: new Date().toISOString(),
      };
      currentAccounts.push(newAccount);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(Array.isArray(postData) ? [newAccount] : newAccount),
      });
    } else if (method === "PATCH" || method === "PUT") {
      const postData = route.request().postDataJSON();
      if (currentAccounts.length > 0) {
        currentAccounts[0] = { ...currentAccounts[0], ...postData };
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(currentAccounts[0]),
        });
      } else {
        await route.fulfill({ status: 200, body: JSON.stringify({}) });
      }
    } else if (method === "DELETE") {
      const url = route.request().url();
      const match = url.match(/id=eq\.([^&]+)/);
      if (match) {
        const deleteId = match[1];
        currentAccounts = currentAccounts.filter(acc => acc.id !== deleteId);
      } else {
        currentAccounts.pop();
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    } else {
      await route.continue();
    }
  });
}

export async function setupCategoriesApiMocks(page: Page, initialCategories: any[] = []) {
  let currentCategories = [...initialCategories];

  await page.route("**/auth/v1/token*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mock-refresh-token",
        user: {
          id: "mock-user-id",
          email: "test@family.com",
          email_confirmed_at: new Date().toISOString(),
        },
      }),
    });
  });

  await page.route("**/auth/v1/user*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "mock-user-id",
        email: "test@family.com",
        email_confirmed_at: new Date().toISOString(),
      }),
    });
  });

  await page.route("**/rest/v1/users*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        first_name: "Test",
        last_name: "User",
        is_verified: true,
      }),
    });
  });

  await page.route("**/rest/v1/categories*", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(currentCategories),
      });
    } else if (method === "POST") {
      const postData = route.request().postDataJSON();
      const newCat = {
        id: `mock-cat-id-${currentCategories.length + 1}`,
        name: Array.isArray(postData) ? postData[0]?.name : postData?.name,
        type: Array.isArray(postData) ? postData[0]?.type : postData?.type,
        created_at: new Date().toISOString(),
      };
      currentCategories.push(newCat);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(Array.isArray(postData) ? [newCat] : newCat),
      });
    } else if (method === "PATCH" || method === "PUT") {
      const postData = route.request().postDataJSON();
      const url = route.request().url();
      const match = url.match(/id=eq\.([^&]+)/);
      if (match && currentCategories.length > 0) {
        const updateId = match[1];
        const index = currentCategories.findIndex(cat => cat.id === updateId);
        if (index !== -1) {
          currentCategories[index] = { ...currentCategories[index], ...postData };
        }
      } else if (currentCategories.length > 0) {
        currentCategories[0] = { ...currentCategories[0], ...postData };
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(currentCategories[0] || {}),
      });
    } else if (method === "DELETE") {
      const url = route.request().url();
      const match = url.match(/id=eq\.([^&]+)/);
      if (match) {
        const deleteId = match[1];
        currentCategories = currentCategories.filter(cat => cat.id !== deleteId);
      } else {
        currentCategories.pop();
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    } else {
      await route.continue();
    }
  });
}

export async function setupTransactionsApiMocks(
  page: Page,
  initialData?: {
    accounts?: any[];
    categories?: any[];
    transactions?: any[];
  }
) {
  let currentAccounts = [...(initialData?.accounts || [])];
  let currentCategories = [...(initialData?.categories || [])];
  let currentTransactions = [...(initialData?.transactions || [])];

  await page.route("**/auth/v1/token*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mock-refresh-token",
        user: {
          id: "mock-user-id",
          email: "test@family.com",
          email_confirmed_at: new Date().toISOString(),
        },
      }),
    });
  });

  await page.route("**/auth/v1/user*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "mock-user-id",
        email: "test@family.com",
        email_confirmed_at: new Date().toISOString(),
      }),
    });
  });

  await page.route("**/rest/v1/users*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        first_name: "Test",
        last_name: "User",
        is_verified: true,
      }),
    });
  });

  await page.route("**/rest/v1/accounts*", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(currentAccounts),
      });
    } else {
      await route.continue();
    }
  });

  await page.route("**/rest/v1/categories*", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(currentCategories),
      });
    } else {
      await route.continue();
    }
  });

  await page.route("**/rest/v1/transactions*", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(currentTransactions),
      });
    } else if (method === "POST") {
      const postData = route.request().postDataJSON();
      const payload = Array.isArray(postData) ? postData[0] : postData;

      const newTx = {
        id: `mock-tx-id-${currentTransactions.length + 1}`,
        description: payload.description,
        amount: Number(payload.amount),
        type: payload.type,
        date: payload.date,
        source_account_id: payload.source_account_id || null,
        destination_account_id: payload.destination_account_id || null,
        category_id: payload.category_id || null,
        notes: payload.notes || null,
        created_at: new Date().toISOString(),
        categories: currentCategories.find(c => c.id === payload.category_id) || null,
        source_accounts: currentAccounts.find(a => a.id === payload.source_account_id) || null,
        destination_accounts: currentAccounts.find(a => a.id === payload.destination_account_id) || null,
      };

      // Balance updates based on transaction type
      if (newTx.type === "Income" && newTx.destination_account_id) {
        const dest = currentAccounts.find(a => a.id === newTx.destination_account_id);
        if (dest) dest.balance += newTx.amount;
      } else if (newTx.type === "Expense" && newTx.source_account_id) {
        const src = currentAccounts.find(a => a.id === newTx.source_account_id);
        if (src) src.balance -= newTx.amount;
      } else if (newTx.type === "Transfer") {
        if (newTx.source_account_id) {
          const src = currentAccounts.find(a => a.id === newTx.source_account_id);
          if (src) src.balance -= newTx.amount;
        }
        if (newTx.destination_account_id) {
          const dest = currentAccounts.find(a => a.id === newTx.destination_account_id);
          if (dest) dest.balance += newTx.amount;
        }
      }

      currentTransactions.unshift(newTx);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(Array.isArray(postData) ? [newTx] : newTx),
      });
    } else if (method === "DELETE") {
      const url = route.request().url();
      const match = url.match(/id=eq\.([^&]+)/);
      let deleteId = match ? match[1] : null;
      if (deleteId && currentTransactions.length > 0) {
        const txToDelete = currentTransactions.find(t => t.id === deleteId);
        if (txToDelete) {
          if (txToDelete.type === "Income" && txToDelete.destination_account_id) {
            const dest = currentAccounts.find(a => a.id === txToDelete.destination_account_id);
            if (dest) dest.balance -= txToDelete.amount;
          } else if (txToDelete.type === "Expense" && txToDelete.source_account_id) {
            const src = currentAccounts.find(a => a.id === txToDelete.source_account_id);
            if (src) src.balance += txToDelete.amount;
          } else if (txToDelete.type === "Transfer") {
            if (txToDelete.source_account_id) {
              const src = currentAccounts.find(a => a.id === txToDelete.source_account_id);
              if (src) src.balance += txToDelete.amount;
            }
            if (txToDelete.destination_account_id) {
              const dest = currentAccounts.find(a => a.id === txToDelete.destination_account_id);
              if (dest) dest.balance -= txToDelete.amount;
            }
          }
          currentTransactions = currentTransactions.filter(t => t.id !== deleteId);
        }
      } else if (currentTransactions.length > 0) {
        currentTransactions.shift();
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    } else {
      await route.continue();
    }
  });
}

