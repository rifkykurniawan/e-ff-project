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
